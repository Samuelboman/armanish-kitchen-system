// Photos in client/public/images that admin can pick for a menu item.
// To offer a new photo: add the file to client/public/images and list it here.
export const SITE_IMAGES = [
  { path: "/images/masa-plates.jpg", label: "Two plates of masa with soup and stew" },
  { path: "/images/masa-bowls.jpg", label: "Bowls of masa with meat, yaji and salad" },
  { path: "/images/kunun-aya.jpeg", label: "Bottles with green caps (Kunun Aya)" },
  { path: "/images/yoghurt.jpg", label: "Bottles with orange caps (yoghurt)" },
  { path: "/images/sweetened.jpeg", label: "REPLACE: describe the photo" },
];

// Same rule as the server (models/MenuItem.js): empty, a site path such as
// /images/x.jpg, or a full https:// link.
export const isValidImagePath = (value) => value === "" || /^(\/(?!\/)[^\s"'<>]*|https:\/\/[^\s"'<>]+)$/.test(value);
