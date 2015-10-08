# Emberek-selectize

A simple selectize component for Ember.js

## Usage

### Local selection

    {{#ek-selectize value=selection placeholder="select an option"}}
        {{#each options as |item|}}
            <option value={{item.id}}> {{item.label}} </option>
        {{/each}}
    {{/ek-selectize}}


### Remote suggestion

    {{ek-selectize
          content=content                   // the suggestions
          value=selection                   // the selected value
          optionValuePath='content.id'      // the path to the property
                                               that will represent the option value
          optionLabelPath='content.title'   // the path to the property
                                               that will represent the option label
          placeholder="search an object..."
          onSearch="searchTerm"}}           // the action send when searching
                                               a suggestion


#### In your controller

    content: Ember.computed(function() {
        return Ember.A();
    }),

    onSearchTermChanged:  Ember.observer('searchTerm', function() {
        // fires and ajax request via the `searchTerm` value and
        // set the content with the results...
    }),

    actions: {
        searchTerm(term) {
            this.set('searchTerm', term);
        }
    }


## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
