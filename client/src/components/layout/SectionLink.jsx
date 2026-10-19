import { Link, useLocation } from "react-router";

// Link to a section of the home page, e.g. <SectionLink id="menu">. Works from any
// page; when already on the home page it scrolls straight to the section.
export default function SectionLink({ id, onClick, ...props }) {
  const location = useLocation();

  const handleClick = (event) => {
    onClick?.(event);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return <Link to={{ pathname: "/", hash: `#${id}` }} onClick={handleClick} {...props} />;
}
