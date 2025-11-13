const fs = require('fs');
const path = require('path');
module.exports = {
  loadPfx: (pfxPath) => {
    if (!fs.existsSync(pfxPath)) throw new Error('Arquivo PFX não encontrado: ' + pfxPath);
    return fs.readFileSync(pfxPath);
  }
};
