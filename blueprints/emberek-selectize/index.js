module.exports = {
  description: '',

  normalizeEntityName: function() {
    // allows us to run ember -g emberek-selectize and not blow up
    // because ember cli normally expects the format
    // ember generate <entitiyName> <blueprint>
  },

  afterInstall: function() {
    return this.addBowerPackageToProject('selectize', '0.12.1');
  }

};
