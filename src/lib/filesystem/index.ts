export { getOpsRoot, getOpsSubpath } from "./config";
export { safeFolderName, assertWithin } from "./safety";
export {
  CLIENT_SUBFOLDERS,
  EMPLOYEE_SUBFOLDERS,
  renderClientReadme,
  renderEmployeeReadme,
  type ClientReadmeMeta,
  type EmployeeReadmeMeta,
} from "./templates";
export {
  scaffoldClientFolder,
  scaffoldEmployeeFolder,
  type ScaffoldResult,
} from "./scaffold";
