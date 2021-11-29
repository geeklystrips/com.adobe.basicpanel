/*
    main.js

    JS functions accessible from HTML scope
*/

(function ()
{
    'use strict';

    var csInterface = new CSInterface();
    // let csInterface = new CSInterface();

                // // Reloads extension panel
                // function reloadPanel() {
                //     console.log("Reloading panel...");
                //     location.reload();
                //     console.log("Panel successfully reloaded.");
                //     // alert("Panel reloaded!");
                // }

    $(document).ready(() => {
        // let csInterface = new CSInterface()

        csInterface.addEventListener("cep.extendscript.event.selectedEvent", (event) => {
            let filename = event.data;
            if (_.isEmpty(filename) === false) {
                currentFilename = filename;
                alert(`file selected: ${currentFilename}`);
            }
        });

    });

    // this is where all the HTML component callback / specialized functions are declared
    // + panel states
    function init() 
    {

        function loadJSX(fileName) {      
            console.log("loadJSX( " + fileName + " )");
            
            var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/scripts/";
            csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
            
            console.log(extensionRoot + fileName);
        }
    
        function sayHi(){
            alert("Hi! This is Bridge speaking.");
            console.log("Bridge said Hi.");
        }

    // themeManager.init();
    //    scaleFactorHandler();

        // this is one way of launching a script with a button
        $("#LoadJsxSample").click(function () {
            loadJSX("StandaloneScriptSample.jsx");
        });

        $("#ReloadPanel").click(function () {
            console.log("Reloading panel...");
            location.reload();
            console.log("Panel successfully reloaded.");
            // alert("Panel reloaded!");
        });

        
    }

    init();

}());