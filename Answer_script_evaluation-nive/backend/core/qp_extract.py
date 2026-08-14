import fitz

def extract_qp_text(qp_path):
    doc = fitz.open(qp_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()
    return full_text