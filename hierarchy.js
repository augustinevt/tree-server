
const getParent = (path) => {
  const match = path.split(',');
  return match[match.length - 2];
}

const makeHierarchy = (array) => {
  const reference = {};
  array.forEach((node) => {

    if(!reference[node.name]) {
      node.children = [];
      reference[node.name] = node
    }

    if( typeof reference[node.name].name === 'undefined') {
      const children = reference[node.name].children;
      reference[node.name] = node;
      reference[node.name].children = children;
    }

    const pathMatch = getParent(node.path)
    const parent = pathMatch ? pathMatch : 'root';

    if (!reference[parent]) {
      reference[parent] = { children: [] }
    }

    reference[parent].children.push(node);
  });

  return reference['root'];

}

module.exports = makeHierarchy;
