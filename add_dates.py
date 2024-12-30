import os
import time

# Directory containing your collection files (adjust as needed)
collection_dir = '_projects'

# Function to get the creation time of a file
def get_creation_time(file_path):
    try:
        stat = os.stat(file_path)
        if hasattr(stat, 'st_birthtime'):  # Unix-like systems
            creation_time = stat.st_birthtime
        else:  # No st_birthtime available, fallback to st_mtime
            creation_time = stat.st_mtime
        
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(creation_time))
    
    except Exception as e:
        print(f"Error getting creation time for {file_path}: {e}")
        return None

# List all files in the directory and filter by extensions
file_paths = [file for file in os.listdir(collection_dir) if file.endswith(('.md', '.html'))]

# If no files found, exit early
if not file_paths:
    print(f"No markdown or HTML files found in {collection_dir}.")
    exit()

# Process the files as usual
for file_name in file_paths:
    file_path = os.path.join(collection_dir, file_name)
    
    try:
        creation_date_time = get_creation_time(file_path)

        if not creation_date_time:
            print(f"Skipping {file_path}, as creation time is not available.")
            continue

        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        if content.startswith('---'):
            front_matter_end_index = content.find('---', 3)
            if front_matter_end_index != -1:
                front_matter = content[3:front_matter_end_index].strip()
                if 'creation_date:' in front_matter:
                    print(f"{file_path} already has a creation_date field.")
                    continue

                updated_front_matter = f"{front_matter}\ncreation_date: {creation_date_time}"
                body = content[(front_matter_end_index + 3):]
                new_content = f"---\n{updated_front_matter}\n---\n{body}"

                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Added creation_date_time to {file_path}")

        else:
            new_content = f"---\ncreation_date: {creation_date_time}\n---\n{content}"
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Added front matter to {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print("Finished processing all files.")
