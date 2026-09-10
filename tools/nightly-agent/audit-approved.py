import json, glob, os

approved = {}
for f in glob.glob('tools/clip-review/state-*/reviews.json'):
    d = json.load(open(f))
    clips = d.get('clips', d)
    for cid, v in clips.items():
        if isinstance(v, dict) and v.get('status') == 'approved':
            approved[cid] = {**v, 'source': f}

print(f"Total approved: {len(approved)}")

idx = {}
for f in ['tools/clip-renderer/out/render-index.json', 'tools/clip-renderer/out/approved/render-index.json', 'tools/clip-renderer/out/run-2026-09-05/render-index.json']:
    if os.path.exists(f):
        idx.update(json.load(open(f)))

ready_files = set(os.listdir('clips-ready'))
out_files = set(os.listdir('tools/clip-renderer/out')) if os.path.isdir('tools/clip-renderer/out') else set()

not_in_index = []
in_index_not_ready = []
for cid in approved:
    keys = [k for k in idx if k.startswith(cid + ':')]
    if not keys:
        not_in_index.append(cid)
    else:
        for k in keys:
            fn = idx[k]
            if fn not in ready_files:
                in_index_not_ready.append((cid, k, fn, fn in out_files))

print(f"\nApproved but NOT in any render-index: {len(not_in_index)}")
for cid in not_in_index:
    print(f"  {cid} | topic={approved[cid].get('topic')} | brand={approved[cid].get('brand')}")

print(f"\nIn render-index but file missing from clips-ready/: {len(in_index_not_ready)}")
for cid, k, fn, in_out in in_index_not_ready:
    print(f"  {cid} | {k} -> {fn} | existsInOutDir={in_out}")
