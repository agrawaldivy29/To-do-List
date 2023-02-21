const express = require("express");
const mongoose = require('mongoose');
const app = express();
const _ = require("lodash");
const dateApp = require(__dirname + "/date.js");

mongoose.set('strictQuery', false);
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://divyagrawal29:Divyidhack1@cluster0.bdqsvuv.mongodb.net/todoListDB', { useNewUrlParser: true, useUnifiedTopology: true });
}

const itemsSchema = { name: String };
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({ name: "Welcome to your To-do List" });
const item2 = new Item({ name: "Hit the + button to add a new item" });
const item3 = new Item({ name: "Hit the checkbox to delete an item" });

const defaultItems = [item1, item2, item3];

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// var itemArray = [];
var workItems = [];

app.get("/", (req, res) => {

    // const date = dateApp.getDate();

    Item.find({}, (err, foundItems) => {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) console.log(err);
                else console.log("Default item added");
            });
            res.redirect("/");
        }
        else {
            res.render("list", { listTitle: "Today", listItems: foundItems });
        }
    });
})

app.post("/", (req, res) => {

    var newItem = req.body.itemName;
    const listName = req.body.button;

    const itemPosted = new Item({ name: newItem });

    if (listName === "Today") {
        itemPosted.save();
        res.redirect("/");
    }
    else 
    {
        List.findOne({ name: listName }, (err, foundList) => {
            if (err) console.log(err);
            else {
                foundList.items.push(itemPosted);
                foundList.save();
                res.redirect("/" + listName);
            }
        })
    }
})

app.post("/delete", (req, res) => {
    // console.log(req.body);
    const listName = req.body.listName;
    const objectId = req.body.checkbox;

    // const date = dateApp.getDate();

    if (listName === "Today") {
        Item.findByIdAndRemove(objectId, err => {
            if (err) console.log(err);
            else {
                console.log("Item deleted");
                res.redirect("/");
            }
        });
    }
    else {
        List.updateOne({ name: listName },
            { $pull: { items: { _id: objectId } } },
            (err) => {
                if (err) console.log(err);
                else res.redirect("/" + listName);
            })
    }
})

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/:customListName", (req, res) => {

    // console.log(req.params.customListName);
    const customListName = _.startCase(req.params.customListName);
    // console.log(customListName);

    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (foundList) {
                res.render("List", { listTitle: foundList.name, listItems: foundList.items })
            }
            else {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })

                list.save();
                res.redirect("/" + customListName);
            }
        }
        else console.log(err);
    })
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(3000, () => {
    console.log("Server has started on port 3000");
})