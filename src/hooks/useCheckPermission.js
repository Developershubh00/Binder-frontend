import Cookies from "js-cookie";

const COOKIE_NAME = "permissions";

const useCheckPermission = () => {
  const permissions = JSON.parse(Cookies.get(COOKIE_NAME) || "[]");

  return (...requiredPermissions) => {
    return requiredPermissions.every((permission) =>
      permissions.includes(permission),
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
