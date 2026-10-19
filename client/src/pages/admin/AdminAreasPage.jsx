import { useCallback, useState } from "react";
import { Bike, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Pill from "../../components/ui/Pill";
import Switch from "../../components/ui/Switch";
import Dialog from "../../components/ui/Dialog";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatusMessage from "../../components/ui/StatusMessage";
import AreaForm from "../../components/admin/AreaForm";
import NoticeBar from "../../components/admin/NoticeBar";
import { useAuth } from "../../context/auth-context";
import { useAdminList } from "../../hooks/useAdminList";
import { useNotice } from "../../hooks/useNotice";
import { usePageTitle } from "../../hooks/usePageTitle";
import { formatNaira } from "../../lib/format";

// Delivery areas and their fixed fees: list, add, edit, switch on/off, delete.
export default function AdminAreasPage() {
  usePageTitle("Admin: delivery areas");
  const { authFetch } = useAuth();
  const loadAreas = useCallback(
    (signal) => authFetch("/api/delivery-areas/all", { signal }).then((result) => result.data),
    [authFetch]
  );
  const { items: areas, setItems: setAreas, status, reload } = useAdminList(loadAreas);
  const [editing, setEditing] = useState(null); // null | "new" | area
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useNotice();

  const sortByName = (list) => [...list].sort((a, b) => a.name.localeCompare(b.name));

  const toggleActive = async (area, active) => {
    setAreas((list) => list.map((a) => (a._id === area._id ? { ...a, active } : a)));
    try {
      await authFetch(`/api/delivery-areas/${area._id}`, { method: "PUT", body: { active } });
      setNotice({ text: `${area.name} is ${active ? "now offered" : "no longer offered"} at checkout.` });
    } catch (error) {
      setAreas((list) => list.map((a) => (a._id === area._id ? { ...a, active: !active } : a)));
      setNotice({ text: `Couldn't update ${area.name}: ${error.message}`, tone: "error" });
    }
  };

  const handleSaved = (saved) => {
    setAreas((list) =>
      sortByName(list.some((a) => a._id === saved._id) ? list.map((a) => (a._id === saved._id ? saved : a)) : [...list, saved])
    );
    setNotice({ text: editing === "new" ? `Added ${saved.name}.` : `Saved ${saved.name}.` });
    setEditing(null);
  };

  const handleDelete = async () => {
    await authFetch(`/api/delivery-areas/${deleting._id}`, { method: "DELETE" });
    setAreas((list) => list.filter((a) => a._id !== deleting._id));
    setNotice({ text: `Deleted ${deleting.name}.` });
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display-heading text-2xl sm:text-3xl">Delivery areas</h1>
          <p className="text-muted">Customers choose one of the areas switched on here; its fee is added to the order.</p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-5" aria-hidden="true" /> Add area
        </Button>
      </div>

      <NoticeBar notice={notice} />

      {status === "loading" && (
        <p role="status" className="py-10 text-center text-muted">
          Loading delivery areas
        </p>
      )}
      {status === "error" && (
        <Card>
          <StatusMessage tone="error" icon={RefreshCw} title="We couldn't load the delivery areas" actions={<Button onClick={reload}>Try again</Button>} />
        </Card>
      )}
      {status === "ready" && areas.length === 0 && (
        <Card>
          <StatusMessage icon={Bike} title="No delivery areas yet" actions={<Button onClick={() => setEditing("new")}>Add the first area</Button>}>
            Until you add one, customers can only choose pickup at checkout.
          </StatusMessage>
        </Card>
      )}
      {status === "ready" && areas.length > 0 && (
        <ul className="space-y-3">
          {areas.map((area) => (
            <li key={area._id}>
              <Card className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 sm:p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold">
                    {area.name}
                    {!area.active && (
                      <Pill tone="subtle" className="ml-2 align-middle">
                        Switched off
                      </Pill>
                    )}
                  </p>
                  <p className="text-sm text-muted">Delivery fee {formatNaira(area.fee)}</p>
                </div>
                <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                  <Switch checked={area.active} onChange={(active) => toggleActive(area, active)} label={`Offer ${area.name} at checkout`} hideLabel />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(area)}>
                      <Pencil className="size-4" aria-hidden="true" /> Edit<span className="sr-only"> {area.name}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleting(area)} className="text-red">
                      <Trash2 className="size-4" aria-hidden="true" /> Delete<span className="sr-only"> {area.name}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add delivery area" : `Edit ${editing?.name ?? ""}`}>
        <AreaForm area={editing === "new" ? null : editing} onSaved={handleSaved} onCancel={() => setEditing(null)} />
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title={`Delete ${deleting?.name ?? ""}?`}
        confirmLabel="Delete area"
        onConfirm={handleDelete}
      >
        Customers won&apos;t be able to choose it any more. Past orders keep the area and fee they were charged. To
        stop offering it for a while instead, switch it off.
      </ConfirmDialog>
    </>
  );
}
