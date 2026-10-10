Java.perform(function() {
    console.log("[*] Analyzing Drawable wrapper classes...");

    function dumpClass(obj, label) {
        console.log("\n=================== " + label + " ===================");
        var cls = obj.getClass();
        console.log("Class Name: " + cls.getName());
        console.log("Superclass: " + (cls.getSuperclass() ? cls.getSuperclass().getName() : "null"));
        
        var ifaces = cls.getInterfaces();
        var ifaceList = [];
        for (var i = 0; i < ifaces.length; i++) ifaceList.push(ifaces[i].getName());
        console.log("Interfaces: " + ifaceList.join(", "));

        console.log("--- Fields ---");
        var fields = cls.getDeclaredFields();
        for (var i = 0; i < fields.length; i++) {
            var f = fields[i];
            f.setAccessible(true);
            try {
                var v = f.get(obj);
                var vStr = "" + v;
                if (vStr.length > 80) vStr = vStr.substring(0, 80) + "...";
                console.log("  " + f.getName() + " (" + f.getType().getName() + ") = " + vStr);
            } catch(e) {
                console.log("  " + f.getName() + " (" + f.getType().getName() + ") = <error: " + e + ">");
            }
        }

        console.log("--- Methods ---");
        var methods = cls.getDeclaredMethods();
        for (var i = 0; i < methods.length; i++) {
            var m = methods[i];
            var mName = m.getName();
            var params = [];
            var pTypes = m.getParameterTypes();
            for (var j = 0; j < pTypes.length; j++) params.push(pTypes[j].getName());
            console.log("  " + mName + "(" + params.join(", ") + ") : " + m.getReturnType().getName());
        }
    }

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var drawables = container.getAllDrawables();
            for (var i = 0; i < drawables.size(); i++) {
                var d = drawables.get(i);
                if (d) {
                    dumpClass(d, "Drawable #" + i);
                }
            }
        },
        onComplete: function() {
            console.log("[*] Done.");
        }
    });
});
