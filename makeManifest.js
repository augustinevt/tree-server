const makeManifest = (array) => {
  const manifest = {};
  // iterate array
    // take name from node as key
    // take node as value

  array.forEach((node)=> {
    manifest[node._id] = node
  });

  return manifest;
}

module.exports = makeManifest;
