Note that isAlumni didn't appear in the populated seller — because it's a virtual field on the User schema, and Mongoose's populate() doesn't include virtuals by default. We'll fix that in a later phase when we build the frontend profile cards, by adding .populate("sellerId", "...").lean({ virtuals: true }) or by exposing the fields the client actually needs.

