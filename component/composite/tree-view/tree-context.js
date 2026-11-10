// Info: the context a TreeView provides its TreeNodes: depth, selection,
// focus and the toggle/set callbacks. Module-level so every factory shares
// the one React context instance.
let treeContext = null;

export default function createTreeContext (ctx) {
  if (treeContext === null) {
    treeContext = ctx.React.createContext(Object.freeze({}));
  }
  return treeContext;
}
