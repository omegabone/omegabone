import json, glob, os, re

approved = {}  # id -> {status, brand, topic, source_dir}
for f in glob.glob('tools/clip-review/state-*/reviews.json'):
    d = json.load(open(f))
    clips = d.get('clips', d)
    for cid, v in clips.items():
        if isinstance(v, dict) and v.get('status') == 'approved':
            approved[cid] = {**v, 'source': f}

print(f"Total approved across all state dirs: {len(approved)}")

ready_files = os.listdir('clips-ready')
ready_lower = [r.lower() for r in ready_files]

def norm(s):
    return re.sub(r'[^a-z0-9]+', '', s.lower())

unrendered = []
for cid, v in approved.items():
    topic = v.get('topic', '')
    ntopic = norm(topic) if topic else None
    # try to find student name prefix from cid
    student = re.match(r'^([a-z]+)', cid).group(1) if re.match(r'^([a-z]+)', cid) else ''
    found = False
    if ntopic:
        for rf in ready_lower:
            if ntopic and ntopic in norm(rf):
                found = True
                break
    if not found:
        unrendered.append((cid, v.get('topic'), v.get('brand'), student))

print(f"\nApproved clips with NO topic match in clips-ready/: {len(unrendered)}")
for cid, topic, brand, student in unrendered:
    print(f"  {cid} | topic={topic!r} | brand={brand} | student={student}")
