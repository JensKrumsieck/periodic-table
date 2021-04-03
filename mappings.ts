//used fields mapping
const fields = new Map<string, string>();
fields.set("Mass number", "AtomicWeight");
fields.set("AtomicWeight", "AtomicWeight");
fields.set("Appearance", "Appearance");
fields.set("Group", "Group");
fields.set("Period", "Period");
fields.set("Block", "Block");
fields.set("Element category", "Category");
fields.set("Electron configuration", "ElectronConfiguration");
fields.set("Electrons per shell", "ElectronsPerShell");
fields.set("Electronegativity", "Electronegativity");
fields.set("Atomic radius", "AtomicRadius");
fields.set("Covalent radius", "CovalentRadius");
fields.set("Van der Waals radius", "VdWRadius");
fields.set("CAS Number", "CAS");

const regex = new Map<string, RegExp>();
regex.set("AtomicWeight", /\d+[.]?\d*/g);
regex.set("Appearance", /.+/g);
regex.set("Group", /\d+/g);
regex.set("Period", /\d/g);
regex.set("Block", /.+/g);
regex.set("Category", /.+/g);
regex.set("ElectronConfiguration", /.+/g);
regex.set("ElectronsPerShell", /.+/g);
regex.set("Electronegativity", /(?!Pauling scale: ?)\d+[.]?\d*/g);
regex.set("CovalentRadius", /\d+/g);
regex.set("AtomicRadius", /\d+/g);
regex.set("VdWRadius", /\d+/g);
regex.set("CAS", /\d+-\d+-\d+/g);

export { fields, regex };