import re

def segment_by_known_questions(full_text, valid_question_numbers):
    part_a_qs = [q for q in valid_question_numbers if int(q) <= 12]
    part_bcd_qs = [q for q in valid_question_numbers if int(q) >= 13]

    # Step 1: sequential search for Part A (1-12) - assumed answered in order
    matches = []
    search_start = 0
    for qnum in part_a_qs:
        pattern = re.compile(rf'(?<![\d(]){re.escape(qnum)}[\.\)]')
        m = pattern.search(full_text, search_start)
        if m:
            matches.append((qnum, m.start(), m.end()))
            search_start = m.end()

    part_a_end = search_start

    # Step 2: order-independent search for 13-19 in the remaining text
    remaining_text = full_text[part_a_end:]
    bcd_matches = []
    for qnum in part_bcd_qs:
        pattern = re.compile(rf'(?<![\d(]){re.escape(qnum)}[\.\)]')
        for m in pattern.finditer(remaining_text):
            bcd_matches.append((qnum, m.start() + part_a_end, m.end() + part_a_end))

    bcd_matches.sort(key=lambda x: x[1])
    seen = set()
    deduped_bcd = []
    for qnum, start, end in bcd_matches:
        if qnum not in seen:
            deduped_bcd.append((qnum, start, end))
            seen.add(qnum)

    matches.extend(deduped_bcd)
    matches.sort(key=lambda x: x[1])

    segments = {}
    for i, (qnum, start, end) in enumerate(matches):
        seg_end = matches[i + 1][1] if i + 1 < len(matches) else len(full_text)
        segments[qnum] = full_text[end:seg_end].strip()

    return segments