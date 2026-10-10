Java.perform(function() {
    console.log("[*] Executing Live In-Memory Reposition PoC on Instagram Template Bitmap...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var drawables = container.getAllDrawables();
            var d0 = drawables.get(0);
            if (!d0) return;

            var fieldA0A = d0.getClass().getDeclaredField("A0A");
            fieldA0A.setAccessible(true);
            var listA0A = Java.cast(fieldA0A.get(d0), Java.use("java.util.List"));
            if (listA0A.size() === 0) return;

            var hgi = listA0A.get(0);
            var fieldA0L = hgi.getClass().getDeclaredField("A0L");
            fieldA0L.setAccessible(true);
            var map = Java.cast(fieldA0L.get(hgi), Java.use("java.util.Map"));
            
            var IntegerCls = Java.use("java.lang.Integer");
            var bmpObj = map.get(IntegerCls.valueOf(0));
            if (!bmpObj) {
                console.log("[-] No bitmap found in map.");
                return;
            }

            var Bitmap = Java.use("android.graphics.Bitmap");
            var Canvas = Java.use("android.graphics.Canvas");
            var Paint = Java.use("android.graphics.Paint");
            var Rect = Java.use("android.graphics.Rect");
            var RectF = Java.use("android.graphics.RectF");
            var Config = Java.use("android.graphics.Bitmap$Config");

            var originalBmp = Java.cast(bmpObj, Bitmap);
            var w = originalBmp.getWidth();
            var h = originalBmp.getHeight();
            console.log("[+] Original Bitmap size: " + w + "x" + h);

            // Create new mutable bitmap of identical dimensions
            var newBmp = Bitmap.createBitmap(w, h, Config.ARGB_8888.value);
            var canvas = Canvas.$new(newBmp);

            // The nameplate bbox is (124, 346, 597, 535)
            // Let's reposition it by moving it UP to y = 120 (a delta of -226 pixels)
            var srcRect = Rect.$new(120, 340, 600, 540);
            var dstRect = Rect.$new(120, 120, 600, 320); // Moved up towards the header!
            var paint = Paint.$new(Paint.ANTI_ALIAS_FLAG.value | Paint.FILTER_BITMAP_FLAG.value);

            canvas.drawBitmap(originalBmp, srcRect, dstRect, paint);
            console.log("[+] Drawn cropped nameplate to new target rect: [120, 120, 600, 320]");

            // Replace bitmap in the map
            map.put(IntegerCls.valueOf(0), newBmp);
            console.log("[+] Replaced bitmap in X.0HGi.A0L map.");

            // Invalidate container
            container.postInvalidate();
            console.log("[+] Successfully called container.postInvalidate()!");
        },
        onComplete: function() {
            console.log("[*] PoC execution completed.");
        }
    });
});
