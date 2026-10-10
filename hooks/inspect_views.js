Java.perform(function() {
    console.log("[*] Searching for InteractiveDrawableContainer in memory...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(instance) {
            console.log("[+] Found InteractiveDrawableContainer instance: " + instance);
            try {
                // Let's inspect methods and fields of this container
                var cls = instance.getClass();
                console.log("    Class: " + cls.getName());
                
                // Inspect all drawables inside it
                // Usually it has a list or method like getAllDrawables() or mDrawables or similar
                var methods = cls.getDeclaredMethods();
                for (var i = 0; i < methods.length; i++) {
                    var m = methods[i];
                    var mName = m.getName();
                    var retType = m.getReturnType().getName();
                    if (retType.indexOf("List") !== -1 || retType.indexOf("Collection") !== -1 || mName.toLowerCase().indexOf("drawable") !== -1) {
                        console.log("    Method: " + mName + " -> " + retType);
                    }
                }
            } catch(e) {
                console.log("    Error inspecting instance: " + e);
            }
        },
        onComplete: function() {
            console.log("[*] Completed search for InteractiveDrawableContainer");
        }
    });
});
