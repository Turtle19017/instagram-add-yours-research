Java.perform(function() {
    console.log("[*] Dumping Bitmap from X.0HGi...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var drawables = container.getAllDrawables();
            var d0 = drawables.get(0);
            if (!d0) return;

            var fieldA0A = d0.getClass().getDeclaredField("A0A");
            fieldA0A.setAccessible(true);
            var listA0A = Java.cast(fieldA0A.get(d0), Java.use("java.util.List"));
            if (listA0A.size() > 0) {
                var hgi = listA0A.get(0);
                var fieldA0L = hgi.getClass().getDeclaredField("A0L");
                fieldA0L.setAccessible(true);
                var map = Java.cast(fieldA0L.get(hgi), Java.use("java.util.Map"));
                console.log("Map size: " + map.size());
                
                var IntegerCls = Java.use("java.lang.Integer");
                var bmpObj = map.get(IntegerCls.valueOf(0));
                if (bmpObj) {
                    var bmp = Java.cast(bmpObj, Java.use("android.graphics.Bitmap"));
                    console.log("Found Bitmap: w=" + bmp.getWidth() + " h=" + bmp.getHeight() + " config=" + bmp.getConfig());

                    var File = Java.use("java.io.File");
                    var FileOutputStream = Java.use("java.io.FileOutputStream");
                    var CompressFormat = Java.use("android.graphics.Bitmap$CompressFormat");
                    
                    var outPath = "/data/data/com.instagram.android/cache/dumped_template_overlay.png";
                    var fos = FileOutputStream.$new(File.$new(outPath));
                    var success = bmp.compress(CompressFormat.PNG.value, 100, fos);
                    fos.flush();
                    fos.close();
                    console.log("Compressed to " + outPath + " -> success=" + success);
                } else {
                    console.log("bmpObj is null!");
                }
            }
        },
        onComplete: function() {
            console.log("[*] Done dump attempt.");
        }
    });
});
