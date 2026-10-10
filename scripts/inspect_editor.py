import xml.etree.ElementTree as ET
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def parse_dump(xml_path):
    tree = ET.parse(xml_path)
    for node in tree.iter():
        text = node.attrib.get('text', '')
        desc = node.attrib.get('content-desc', '')
        bounds = node.attrib.get('bounds', '')
        cls = node.attrib.get('class', '')
        res_id = node.attrib.get('resource-id', '')
        if text or desc:
            print(f"[{cls}] id={res_id} bounds={bounds} text={repr(text)} desc={repr(desc)}")

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "d:/ins/window_dump.xml"
    parse_dump(path)
