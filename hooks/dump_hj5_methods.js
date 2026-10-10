Java.perform(function() {
    console.log("[*] Dumping X.0Hj5 methods...");
    var cls = Java.use("X.0Hj5").class;
    var methods = cls.getDeclaredMethods();
    for (var i = 0; i < methods.length; i++) {
        var m = methods[i];
        var params = [];
        var pTypes = m.getParameterTypes();
        for (var j = 0; j < pTypes.length; j++) params.push(pTypes[j].getName());
        console.log("  " + m.getName() + "(" + params.join(", ") + ") : " + m.getReturnType().getName());
    }
});
