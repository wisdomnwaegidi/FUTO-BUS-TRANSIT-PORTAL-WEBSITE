const ShuttleForm = require("../model/shuttleFormSchema");
const Userdb = require("../model/userModel");

exports.findTicket = async (req, res) => {
  try {
    const shuttleForm = new ShuttleForm(req.body);
    await shuttleForm.save();
    // res.redirect(`/tickets/${shuttleForm._id}`);
    res.send("Form submitted successfully");
  } catch (error) {
    res.status(400).render("/", {
      errors: [{ msg: "internal server error" }],
      data: req.body,
    });
  }
};

exports.tickets = async (req, res) => {
  try {
    const form = await ShuttleForm.findById(req.params.id);
    if (!form) {
      return res.status(404).send("Form not found");
    }
    // For demonstration, we'll just send the form data. Replace this with your logic to fetch tickets.
    res.render("tickets", { form });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
