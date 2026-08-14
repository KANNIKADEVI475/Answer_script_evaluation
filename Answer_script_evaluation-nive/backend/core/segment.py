import re


def segment_by_known_questions(full_text, valid_question_numbers):

    matches = []

    for qnum in valid_question_numbers:

        # More OCR-friendly pattern
        pattern = re.compile(
            rf'(?m)^\s*{re.escape(qnum)}\s*[\.\):-]?'
        )

        for m in pattern.finditer(full_text):

            matches.append((
                qnum,
                m.start(),
                m.end()
            ))

    # Sort by position
    matches.sort(key=lambda x: x[1])

    # Remove duplicate question numbers
    final_matches = []
    seen = set()

    for item in matches:

        qnum = item[0]

        if qnum not in seen:
            final_matches.append(item)
            seen.add(qnum)

    segments = {}

    for i, (qnum, start, end) in enumerate(final_matches):

        if i + 1 < len(final_matches):
            next_start = final_matches[i + 1][1]
        else:
            next_start = len(full_text)

        segments[qnum] = full_text[end:next_start].strip()

    return segments