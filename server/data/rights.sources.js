// A simple registry of where we pull data per topic.
// Replace placeholder URLs with the real ones you choose later.
module.exports = {
  abortion: {
    // Example: one canonical source page per state (or a single API with ?state=XX)
    // key: state code; value: URL
    // Start with a couple states and expand.
    CA: "https://example.org/abortion/CA",
    TX: "https://example.org/abortion/TX",
  },
  parentage: {
    CA: "https://example.org/parentage/CA",
    TX: "https://example.org/parentage/TX",
  },
};
