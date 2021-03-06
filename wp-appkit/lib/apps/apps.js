// build the Subject base class
var Subject = ( function( window, undefined ) {
    function Subject() {
        this._list = [];
    }

    // this method will handle adding observers to the internal list
    Subject.prototype.observe = function( obj ) {
        this._list.push( obj );
    };

    Subject.prototype.unobserve = function( obj ) {
        for( var i = 0, len = this._list.length; i < len; i++ ) {
            if( this._list[ i ] === obj ) {
                this._list.splice( i, 1 );
                return true;
            }
        }
        return false;
    };

    Subject.prototype.notify = function() {
        var args = Array.prototype.slice.call( arguments, 0 );
        for( var i = 0, len = this._list.length; i < len; i++ ) {
            this._list[ i ].update.apply( null, args );
        }
    };

    return Subject;
})( window );

function wizard_update( uncheck ) {
    if( !uncheck ) {
        this.addClass( 'list-group-item-success' );
        this.find( '.glyphicon' ).removeClass( 'glyphicon-unchecked' ).addClass( 'glyphicon-check' );
    }
    else {
        this.removeClass( 'list-group-item-success' );
        this.find( '.glyphicon' ).removeClass( 'glyphicon-check' ).addClass( 'glyphicon-unchecked' );
    }
}

jQuery().ready(function(){
    var $ = jQuery,
        wizard_title = $( '#wpak_app_wizard_title' ),
        wizard_components = $( '#wpak_app_wizard_components' ),
        wizard_navigation = $( '#wpak_app_wizard_navigation' ),
        wizard_phonegap = $( '#wpak_app_wizard_phonegap' ),
        wizard_save = $( '#wpak_app_wizard_save' ),
        title = $( '#title' ),
        app_title = $( '#wpak_app_title' );

    var wizard_components_observer = {
        update: function() {
            var uncheck = $( '.component-row' ).length == 0;

            wizard_update.apply( wizard_components, [uncheck] );
        }
    };

    var wizard_navigation_observer = {
        update: function() {
            var uncheck = $( '#navigation-items-table tr > td' ).length == 0 || app_title.val().length == 0;

            wizard_update.apply( wizard_navigation, [uncheck] );
        }
    };

    var wizard_title_observer = {
        update: function() {
            var uncheck = title.val().length == 0;

            wizard_update.apply( wizard_title, [uncheck] );
        }
    };

    function phonegap_ok() {
        var ret = true;
        Apps.phonegap_mandatory.map( function( key ) {
            var input = $( '#wpak_app_' + key );
            if( input.length && !input.val().length ) {
                ret = false;
                return;
            }
        });

        return ret;
    }

    var wizard_phonegap_observer = {
        update: function() {
            var uncheck = !phonegap_ok();

            wizard_update.apply( wizard_phonegap, [uncheck] );
        }
    };

    WpakComponents.addObserver( wizard_components_observer );
    WpakNavigation.addObserver( wizard_navigation_observer );
    app_title.on( 'keyup', wizard_navigation_observer.update )
    title.on( 'keyup', wizard_title_observer.update );
    $( 'input, textarea', '#wpak_app_phonegap_data' ).on( 'keyup', wizard_phonegap_observer.update );

    $( '#poststuff' ).on( 'click', '.wpak_help', function( e ) {
        e.preventDefault();
        var $this = $(this);

        $this.parent().find( '.description' ).toggle( 300 );

        if( $this.text() == Apps.i18n.show_help ) {
            $this.text( Apps.i18n.hide_help );
        }
        else {
            $this.text( Apps.i18n.show_help );
        }
    });

});