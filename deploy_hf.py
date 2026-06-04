"""
Porsche GT3 RS - Hugging Face Spaces Deployment Script
Uploads in batches: HTML/CSS/JS first, then videos in smaller chunks.
Usage: python deploy_hf.py <HF_TOKEN>
"""
import sys
import os
import glob
from huggingface_hub import HfApi, login

def main():
    if len(sys.argv) < 2:
        print("Usage: python deploy_hf.py <HF_TOKEN>")
        sys.exit(1)

    token = sys.argv[1]
    
    print("[1/5] Logging in to Hugging Face...")
    login(token=token, add_to_git_credential=False)
    
    api = HfApi()
    user_info = api.whoami()
    username = user_info["name"]
    print(f"  Logged in as: {username}")

    repo_id = f"{username}/Porsche-911-GT3-RS"
    
    print(f"[2/5] Creating Space: {repo_id}...")
    try:
        api.create_repo(
            repo_id=repo_id,
            repo_type="space",
            space_sdk="static",
            exist_ok=True,
        )
        print(f"  Space ready: https://huggingface.co/spaces/{repo_id}")
    except Exception as e:
        print(f"  Space note: {e}")
    
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
    
    if not os.path.isdir(out_dir):
        print(f"ERROR: 'out' directory not found at {out_dir}")
        sys.exit(1)
    
    # --- BATCH 1: Upload everything EXCEPT videos ---
    print(f"\n[3/5] Uploading HTML, CSS, JS, and images (batch 1)...")
    api.upload_folder(
        folder_path=out_dir,
        repo_id=repo_id,
        repo_type="space",
        commit_message="Deploy Porsche GT3 RS - HTML/CSS/JS/Images",
        ignore_patterns=["videos/*"],
    )
    print("  Batch 1 complete!")
    
    # --- BATCH 2: Upload videos one at a time ---
    videos_dir = os.path.join(out_dir, "videos")
    if os.path.isdir(videos_dir):
        video_files = sorted(glob.glob(os.path.join(videos_dir, "*.mp4")) + glob.glob(os.path.join(videos_dir, "*.webm")) + glob.glob(os.path.join(videos_dir, "*.bin")))
        total = len(video_files)
        print(f"\n[4/5] Uploading {total} video files (one per commit)...")
        
        for i, vpath in enumerate(video_files):
            fname = os.path.basename(vpath)
            print(f"  [{i+1}/{total}] Uploading {fname} ({os.path.getsize(vpath) / 1048576:.1f} MB)...")
            api.upload_file(
                path_or_fileobj=vpath,
                path_in_repo=f"videos/{fname}",
                repo_id=repo_id,
                repo_type="space",
                commit_message=f"Add video: {fname}",
            )
            print(f"  [{i+1}/{total}] Done!")
    
    space_url = f"https://huggingface.co/spaces/{repo_id}"
    print(f"\n[5/5] DEPLOYMENT COMPLETE! [FLAG]")
    print(f"  Space URL: {space_url}")
    print(f"  Direct link: https://{username}-porsche-911-gt3-rs.static.hf.space")
    print(f"\n  It may take 1-2 minutes for the Space to build and go live.")

if __name__ == "__main__":
    main()
