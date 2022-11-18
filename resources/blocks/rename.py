# a script to rename all the imahe png of the folder

import os
import sys

def rename(path, prefix):
    files = os.listdir(path)
    for i, file in enumerate(files):
        if file.endswith('.png'):
            os.rename(os.path.join(path, file), os.path.join(path, str(i) + '.png'))

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: python rename.py path prefix')
        sys.exit(1)
    rename(sys.argv[1], sys.argv[2])
