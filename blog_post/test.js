const mongoose = require("mongoose");
const BlogPost = require("./models/BlogPost");
mongoose.connect("mongodb://localhost/my_database");

// async function createBlogPost() {
//   try {
//     const blogpost = await BlogPost.create({
//       title: "The Mythbuster Guide to Saving Money on Energy Bills",
//       body: "If you have been here a long time, you might remember when I went on ITV Tonight to dispense a masterclass in saving money on energy bills. Energy-saving is one of my favourite money topics, because once you get past the boring bullet-point lists, a whole new world of thrifty nerdery opens up. You know those bullet-point lists. You start spotting them everything at this time of year. They go like this:",
//     });
//     console.log(blogpost);
//   } catch (error) {
//     console.log(error);
//   }
// }

// createBlogPost();

// BlogPost.find({})
//   .then((blogpost) => {
//     console.log(blogpost);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// BlogPost.find({
//   title: "The Mythbuster’s Guide to Saving Money on Energy Bills",
// })
//   .then((blogpost) => {
//     console.log(blogpost);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
var id = "69947b2952baaa41e13fa7e2";
// BlogPost.findById(id)
//   .then((blogpost) => console.log(blogpost))
//   .catch((error) => {
//     console.log(error);
//   });

// async function Update() {
//   const blogpost = await BlogPost.findByIdAndUpdate(
//     id,
//     {
//       title: "Title updated 235",
//     },
//     { new: true },
//   );
//   try {
//     console.log(blogpost);
//   } catch (error) {
//     console.log(error);
//   }
// }

// Update();

async function deleteItem() {
  try {
    const blogpost = await BlogPost.findByIdAndDelete(id);
    console.log(blogpost);
  } catch (error) {
    console.log(error);
  }
}

deleteItem();
