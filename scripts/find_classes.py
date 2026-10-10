import frida
import sys

def main():
    device = frida.get_usb_device()
    session = device.attach("Instagram")
    
    import threading
    done_event = threading.Event()
    def on_msg(message, data):
        if message.get("type") == "send":
            print(message.get("payload"))
            if message.get("payload") == "DONE":
                done_event.set()
        else:
            print(message)

    js = """
    Java.perform(function() {
        var count = 0;
        Java.enumerateLoadedClasses({
            onMatch: function(className) {
                var lower = className.toLowerCase();
                if (lower.indexOf("storytemplate") !== -1 || 
                    lower.indexOf("interactivedrawablecontainer") !== -1 ||
                    lower.indexOf("promptsticker") !== -1 ||
                    lower.indexOf("pinnedsticker") !== -1) {
                    send("[MATCH] " + className);
                    count++;
                }
            },
            onComplete: function() {
                send("Matches found: " + count);
                send("DONE");
            }
        });
    });
    """
    
    script = session.create_script(js)
    script.on("message", on_msg)
    script.load()
    done_event.wait(timeout=30)

if __name__ == "__main__":
    main()
