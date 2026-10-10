Java.perform(function() {
    console.log("[*] EXPERIMENT A: Controlled transform of Drawable #0...");

    Java.choose("com.instagram.ui.widget.interactive.InteractiveDrawableContainer", {
        onMatch: function(container) {
            var fieldA17 = container.getClass().getDeclaredField("A17");
            fieldA17.setAccessible(true);
            var list = Java.cast(fieldA17.get(container), Java.use("java.util.List"));
            if (list.size() === 0) {
                console.log("[-] No items in container.A17");
                return;
            }

            var hj0 = Java.cast(list.get(0), Java.use("X.0Hj5"));
            var origX = hj0.CzU();
            var origY = hj0.CzV();
            var origScale = hj0.BWl();
            console.log("[+] Baseline transform:");
            console.log("    Translation X (CzU): " + origX);
            console.log("    Translation Y (CzV): " + origY);
            console.log("    Scale (BWl): " + origScale);

            // Let's inspect fields in hj0 that store translation
            var cls = hj0.getClass();
            var fA01 = cls.getDeclaredField("A01"); fA01.setAccessible(true);
            var fA02 = cls.getDeclaredField("A02"); fA02.setAccessible(true);
            var fMatrix = cls.getDeclaredField("A0o"); fMatrix.setAccessible(true);

            console.log("    Field A01: " + fA01.get(hj0));
            console.log("    Field A02: " + fA02.get(hj0));
            console.log("    Matrix A0o: " + fMatrix.get(hj0));

            // Test displacement: move by +60 local pixels along X and -80 along Y
            var targetX = origX + 60.0;
            var targetY = origY - 80.0;
            console.log("[+] Applying test displacement -> Target: X=" + targetX + ", Y=" + targetY);

            // Method HC7 sets X translation, HC8 sets Y translation
            try {
                hj0.HC7(targetX);
                hj0.HC8(targetY);
                console.log("[+] Called HC7 and HC8.");
            } catch(e) {
                console.log("[-] HC7/HC8 call failed: " + e);
            }

            // Also check if matrix update method exists (e.g. A02(hj0) or A04(hj0) or A05(hj0))
            try {
                var mA05 = cls.getDeclaredMethod("A05", [cls]);
                mA05.setAccessible(true);
                mA05.invoke(null, [hj0]);
                console.log("[+] Called A05(hj0) to recompute matrix.");
            } catch(e) {
                console.log("[*] A05 recompute note: " + e);
            }

            console.log("[+] New Translation X (CzU): " + hj0.CzU());
            console.log("[+] New Translation Y (CzV): " + hj0.CzV());
            console.log("[+] New Matrix A0o: " + fMatrix.get(hj0));

            // Trigger redraw on UI thread
            var handler = Java.use("android.os.Handler").$new(Java.use("android.os.Looper").getMainLooper());
            var Runnable = Java.use("java.lang.Runnable");
            var RedrawRunnable = Java.registerClass({
                name: "com.research.RedrawRunnableA",
                implements: [Runnable],
                methods: {
                    run: function() {
                        try {
                            container.invalidate();
                            container.requestLayout();
                            console.log("[+] Container invalidated on UI thread.");
                        } catch(err) {
                            console.log("[-] Invalidate error: " + err);
                        }
                    }
                }
            });
            handler.post(RedrawRunnable.$new());
        },
        onComplete: function() {
            console.log("[*] Experiment A hook execution finished.");
        }
    });
});
