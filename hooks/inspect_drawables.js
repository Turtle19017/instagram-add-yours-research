Java.perform(function() {
    console.log("[*] Inspecting drawables inside InteractiveDrawableContainer...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            console.log("\n[+] Found container: " + container.getId());
            try {
                var drawables = container.getAllDrawables();
                console.log("    Total drawables count: " + drawables.size());
                
                for (var i = 0; i < drawables.size(); i++) {
                    var d = drawables.get(i);
                    if (d === null) continue;
                    var dCls = d.$className;
                    console.log("\n    --- Drawable #" + i + " ---");
                    console.log("    Class: " + dCls);
                    try {
                        var bounds = d.getBounds();
                        console.log("    Bounds: " + (bounds ? bounds.toString() : "null"));
                    } catch(e) {
                        console.log("    Bounds err: " + e);
                    }
                    console.log("    toString(): " + d.toString());
                }
            } catch(e) {
                console.log("    Error: " + e);
            }
        },
        onComplete: function() {
            console.log("\n[*] Done inspecting drawables.");
        }
    });
});
