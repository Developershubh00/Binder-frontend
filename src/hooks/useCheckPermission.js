import Cookies from "js-cookie";

// The `user_permissions` cookie holds the flat permission list as a compact
// comma-separated string (set in authService.getMyPermissions), e.g.
//   "code.buyer.all.create,code.buyer.all.read,code.ess.all.create,..."
const COOKIE_NAME = "user_permissions";

const useCheckPermission = () => {
  // Read the cookie fresh on every check so event handlers and live permission
  // changes are always reflected (no stale render-time snapshot). Parsing is
  // cheap and checks are sparse, so this is negligible.
  //   checkPermission("code.buyer.all.create")
  //   checkPermission("code.buyer.all.create", "code.buyer.all.read")
  return (...requiredPermissions) => {
    const raw = Cookies.get(COOKIE_NAME) || "";
    const permissions = new Set(raw ? raw.split(",") : []);
    return requiredPermissions.every((permission) =>
      permissions.has(permission),
    );
  };
};

export default useCheckPermission;

//HOW TO USE INSTRUCTIONS KEEPING IN VERY SHORT AND EASY WAY:
//HOW TO USE INSTRUCTIONS KEEPING IN VERY SHORT AND EASY WAY:
//HOW TO USE INSTRUCTIONS KEEPING IN VERY SHORT AND EASY WAY:
//HOW TO USE INSTRUCTIONS KEEPING IN VERY SHORT AND EASY WAY:

// import useCheckPermission from "../hooks/useCheckPermission";

// const checkPermission = useCheckPermission();

// checkPermission("task.create");
// // true

// checkPermission("task.create", "users.create");
// // true

// checkPermission("task.create", "users.delete");
// // false
