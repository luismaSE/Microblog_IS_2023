command -v python3 >/dev/null 2>&1 || { echo >&2 "python3 is not installed.  Aborting."; exit 1; }

python3 -m venv .

source bin/activate
pip install --upgrade pip
pip3 install -r requirements.txt
