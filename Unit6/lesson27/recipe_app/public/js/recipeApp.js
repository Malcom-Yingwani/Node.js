$(document).ready(() => {
  $("#modal-button").click(async () => {
    $(".modal-body").html("");

    try {
      const results = await $.get("/api/courses");
      const data = results.data;

      if (!data || !data.courses) return;

      data.courses.forEach((course) => {
        $(".modal-body").append(
          `<div>
            <span class="course-title">
              ${course.title}
            </span>
            <button class='button ${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">
              ${course.joined ? "Joined" : "Join"}
            </button>
            <div class="course-description">
              ${course.description}
            </div>
          </div>`,
        );
      });

      addJoinButtonListener();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  });
});

let addJoinButtonListener = () => {
  $(".join-button").click((event) => {
    let $button = $(event.target),
      courseId = $button.data("id");
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) {
        $button
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text("Try again");
      }
    });
  });
};
