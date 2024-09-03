class ElementsHtml {
  static async verMas() {
    const div = document.createElement('div');
    div.id = 'ScreenControlHyperlink36456';
    div.className = 'ScreenControlHyperlink summarypaneheadermediumlabel hideemptydiv row';

    const a = document.createElement('a');
    a.id = 'verMasInfomacion';
    a.className = 'detailpaneheaderlabel ScreenControlHyperlink';
    a.setAttribute('role', 'buttton');
    a.style = 'cursor: auto; pointer-events: auto;';
    a.href = 'javascript:void(0);';

    div.appendChild(a);
    return div;
  }

  static createElement({ id }) {
    const div = document.createElement('div');
    div.className = 'ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row';

    const label = document.createElement('label');
    label.id = id;
    label.className = 'detailpaneheaderlabel';

    div.appendChild(label);

    return div;
  }
}