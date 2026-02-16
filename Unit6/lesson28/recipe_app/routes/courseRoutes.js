const router = require("express").Router();
const courseController = require("../controllers/coursesController");

router.get("/", courseController.showCourses);
router.get("/new", courseController.new);
router.post("/create", courseController.create, courseController.redirectView);
router.get("/:id", courseController.show, courseController.showView);
router.get("/:id/edit", courseController.edit);
router.put(
  "/:id/update",
  courseController.update,
  courseController.redirectView,
);
router.delete(
  "/:id/delete",
  courseController.delete,
  courseController.redirectView,
);

module.exports = router;
