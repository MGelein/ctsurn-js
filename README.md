# CTS Urn JS
This repository contains a simple Javascript Class implementation of the CTS URN, as defined by the Homer Multitext project.

The class follows the naming and conventions as specified in the [specs](https://github.com/cite-architecture/ctsurn_spec/blob/master/md/specification.md) found on the Github page of the original library.

## Usage
You can create a new `CTSUrn` object in Javascript using the following code after you've embedded the `ctsurn.js` file in your `.html` file.
```
var ctsUrn = new CTSUrn("urn:cts:greekLit:tlg0012.tlg001.msA:1.1");
```
This created object can be interacted with using the following methods and variables:
- `.urn` = This variable will hold your input as it's being parsed and after that contains the parsed portion of your urn.
- `.namespace` = Contains the namespace for this urn. Should **always** be `cts`.
- `.work` = This is the first complex object. This contains all information concerning the work, such as:
 - `.work.print()` = This function will pretty-print the work-component of this urn.
 - `.work.textgroup` = The textgroup this work belongs to. This part is **mandatory**.
 - `.work.work` = The work in the specified textgroup. This part is **optional** and `undefined` if not found.
 - `.work.version`= The version of the specified work in the specified textgroup. This part is **optional** and `undefined` if not found.
 - `.work.exemplar` = The exemplar of the version of the specified work. This part is **optional** and `undefined` if not found.
- `.passage` = This is the passage component of the urn. A modded JS Array, with an added method for pretty-printing the result. This whole component is **optional**.
 - `.passage.isRange()` = Returns a boolean value if this is a range. Basically only checks if the passage is an array with a length of more than one.
 - `.passage.print()` = Pretty-prints the whole passage, whether it's a range or not.
 - `.passage[0]` = The first node in the passage. Also the only node in the passage if the passage is *not* a range. 
 - `.passage[1]` = The second node in the passage. Only available in the passage if the passage is a range.
 - `.passage[0].node` = The location of the citeable node. 
 - `.passage[0].node.print()` = Pretty-prints the specified node.
 - `.passage[0].node.subsection` = The subsection for the specified citeable node. 
 - `.passage[0].node.subsection.character` = The character that specifies the subsection
 - `.passage[0].node.subsection.index` = The index of the above defined character this subsection starts at.

## Example
Below you can see what _"urn:cts:greekLit:tlg0012.tlg001.msA:1.1@α[3]-1.5@ε[2]"_ looks like as a CTSUrn object when you convert
it to JSON:
```
{
  "urn": "urn:cts:greekLit:tlg0012.tlg001.msA:1.1@α[3]-1.5@ε[2]",
  "protocol": "cts",
  "namespace": "greekLit",
  "work": {
    "textgroup": "tlg0012",
    "work": "tlg001",
    "version": "msA"
  },
  "passage": [
    {
      "node": "1.1",
      "subsection": {
        "character": "α",
        "index": 3
      }
    },
    {
      "node": "1.5",
      "subsection": {
        "character": "ε",
        "index": 2
      }
    }
  ]
}
``` 