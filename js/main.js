/*
    main.js

    JS functions accessible from HTML scope
*/

(function ()
{
    'use strict';

    var csInterface = new CSInterface();
    var debugPort = null;

    $(document).ready(() => {
        csInterface.addEventListener("cep.extendscript.event.selectedEvent", (event) => {
            let filename = event.data;
            if (_.isEmpty(filename) === false) {
                currentFilename = filename;
                alert(`file selected: ${currentFilename}`);
            }
        });

    });

    // init() is where all the HTML component callback / specialized functions are declared
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
        };

        function updateTheme()
        {
            console.log("Applying CSS rules...");
            var theme = csInterface.getHostEnvironment();
            var themeInfo = theme.appSkinInfo;
           
            if(themeInfo != undefined)
            {
                if(!isNaN(themeInfo.appBarBackgroundColor.color.red))
                {

                    document.getElementById('hostStyle').href = themeInfo.appBarBackgroundColor.color.red < 128 ? "css/topcoat-desktop-dark.css" : "css/topcoat-desktop-light.css";
                }
                console.log("CSS applied successfully.");
            }
            else
            {
                console.log("ERROR applying CSS!");
            }
        };

        /*  adapted from https://github.com/adobe-photoshop/generator-panels */
        function activateDebugLinks()
        {
            var fs = cep_node.require('fs');
            // var debugPort; // moved to global

            var debugPath = csInterface.getSystemPath( SystemPath.EXTENSION ) +  "/.debug";
            var debugPresent = localfileExists(debugPath);

            if (debugPresent) {
                $(".debuglink").toggle( true );
                var debugText = fs.readFileSync(debugPath, "utf8");
               // alert(debugText)
                var m = debugText.match(/<Host.*Port="(\d+)"[/]>/m);
                console.log(".debug file found. Port: " + m[1]);
                
                // Enable the debug link only if we know the port.
                if (m)
                    debugPort = m[1];
                else
                    $("#debug").toggle( false );
            }
            else
                $(".debuglink").toggle( false );
        };

        // this is one way of launching a script with a button
        $("#LoadJsxSample").click(function () {
            loadJSX("StandaloneScriptSample.jsx");
        });
        
        // reload panel
        $("#ReloadPanel").click(function () {
            console.log("Reloading panel...");
            location.reload();

            updateTheme();

            console.log("Panel successfully reloaded.");
            // alert("Panel reloaded!");
        });

        // Can't find a consistent way to actively change the theme yet
        // only updating content with eventlistener for now. 

        // $("#SelectDarkestTheme").click(function () {
        //     console.log("Applying Darkest theme.");
        // });

        // $("#SelectDarkTheme").click(function () {
        //     console.log("Applying Dark theme.");
        // });

        // $("#SelectLightTheme").click(function () {
        //     console.log("Applying Light theme.");
        // });

        // $("#SelectLighestTheme").click(function () {
        //     console.log("Applying Lightest theme.");
        // });

        // These are just developer shortcuts; they shouldn't appear in non-debug panels
        $("#reload").click( function() { 
            // console.log(location);
            location.reload(true); 
        } );
        $("#sources").click( function() { csInterface.openURLInDefaultBrowser("https://github.com/geeklystrips/com.adobe.basicpanel"); } );
        // This assumes CHROME is your default browser!
        $("#debug").click( function() { if (debugPort) csInterface.openURLInDefaultBrowser("http://localhost:"+debugPort); } );

        // list files located at root of extension folder
        function readfs() {
            var path = csInterface.getSystemPath( SystemPath.EXTENSION );
    
            // get file list from Node's 'fs' module
            // starting with CSXS 8.0, require() no longer works by itself, must use cep_node.require()
            var fs = cep_node.require('fs');
            var list = fs.readdirSync(path);
    
            // show list of files
            alert( list.join("\n") );
        };

        function localfileExists(path)
        {
            var fs = cep_node.require('fs');
            var fileDoesExistsSync = null;
            fileDoesExistsSync = fs.existsSync(path);
            return fileDoesExistsSync;
        };

        function debugFileExists()
        {
            // not sure this works on Windows
            return fileExists(location.toString().replace("index.html", ".debug"));
        };

        // basic skinInfo toggle (if current is light, apply dark, vice-versa)
        $("#SwapLightDark").click(function () {

            // let's work with a fresh csInterface object each time the button is pressed?
            var csi = new CSInterface();
            var themeInfo = csi.getHostEnvironment().appSkinInfo;
            var extensionPath = csi.getSystemPath(SystemPath.EXTENSION);
          
            var debugPresent = localfileExists(extensionPath+"/.debug");

            // https://theiviaxx.github.io/photoshop-docs/CEP/csinterface.html
            // var fontFamily = themeInfo.baseFontFamily; // The base font family of the application.
            // var fontSize = themeInfo.baseFontSize; // The base font size of the application.
            var appBarBgCol = themeInfo.appBarBackgroundColor; // The application bar background color.
            var appBarBgColSRGB = themeInfo.appBarBackgroundColorSRGB; // The application bar background color, as sRGB.
            var panelBgCol = themeInfo.panelBackgroundColor; // The background color of the extension panel.
            // var panelBgColSRGB = themeInfo.panelBackgroundColorSRGB; // The background color of the extension panel, as sRGB.
            // var systemHighlightCol = themeInfo.systemHighlightColor; // The operating-system highlight color, as sRGB.
            
            var red;
            var panelCol;
            var panelMatchesApp = true;

            if(themeInfo != undefined)
            {
                red = appBarBgCol.color.red;
                panelCol = panelBgCol.color.red;
                panelMatchesApp = (red == panelCol);

                if(!isNaN(red))
                {
                    // if you need to be more thorough, values since CC 2015 are: 
                    //  50, 83, 184, 240
                    if(!panelMatchesApp)
                    {
                        document.getElementById('hostStyle').href = panelCol > 128 ? "css/topcoat-desktop-dark.css" : "css/topcoat-desktop-light.css";
                    }
                }
            }
             var isDark = appBarBgCol.color.red < 128;
            //  console.log("appBarBgCol: " + appBarBgCol.color.red + "   appBarBgColSRGB: " + appBarBgColSRGB.color.red + "\nisDark: " + isDark);
            //  console.log("panelBgCol: " + panelBgCol.color.red + "   panelBgCol: " + panelBgCol.color.red + "\nisDark: " + (panelBgCol.color.red < 128));
            //  console.log("panelMatchesApp: " + panelMatchesApp);
            });
        
        // have the current csInterface object subscribe to the theme color change event, then update visuals accordingly
        csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, updateTheme);
        activateDebugLinks();
    }

    init();

}());