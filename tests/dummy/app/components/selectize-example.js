import Ember from 'ember';

export default Ember.Component.extend({

    selectedType: null,
    selectedObject: null,

    searchTerm: null,

    types: Ember.computed(function() {
        let results = Ember.A([
            {id: 'taxonomy', label: 'Taxonomy'},
            {id: 'site', label: 'Site'},
            {id: 'individual', label: 'Individual'}
        ]);
        return results;
    }),

    content: Ember.computed(function() {
        return Ember.A();
    }),

    initialize: Ember.on('init', function() {
        let selectedType = this.get('selectedType') || 'publication';
        let that = this;
        if (selectedType) {
            $.ajax({
                url: `http://0.0.0.0:8888/api/1/${selectedType}`,
                type: 'GET',
                error: function() {
                    // callback();
                },
                success: function(res) {
                    that.set('content', res.results);
                }
            });
        }
    }),

    onSearchTermChanged:  Ember.observer('searchTerm', 'selectedType', function() {
        let selectedType = this.get('selectedType');
        let query = this.get('searchTerm');
        let url = `http://0.0.0.0:8888/api/1/${selectedType}`;
        if (query) {
            url += '?' + encodeURIComponent('title[$iregex]') + '=' + encodeURIComponent(query);
        }
        let that = this;
        $.ajax({
            url: url,
            type: 'GET',
            error: function() {
                // callback();
            },
            success: function(res) {
                that.set('content', res.results);
            }
        });
    }),

    actions: {
        searchTerm(term) {
            this.set('searchTerm', term);
        }
    }
});