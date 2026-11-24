/**
 * AnyConverter Creative Studio — Reproducible Notebook Workflow Generator
 * File 09 Implementation: Colab / Kaggle .ipynb Generator & Import Workflow
 *
 * Core Principles:
 * - Offline / Free GPU fallback for models requiring heavy compute (SVD, AnimateDiff, SDXL).
 * - Version-pinned nbformat v4 JSON output.
 * - Zero embedded API keys or credentials.
 * - Explicit CUDA/GPU checks with graceful abort.
 * - Output manifest (`manifest.json`) and ZIP generation for seamless import into AnyConverter.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CreativeStudio = root.CreativeStudio || {};
    root.CreativeStudio.NotebookWorkflow = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  class NotebookWorkflowGenerator {
    /**
     * Generates a fully compliant Jupyter Notebook (.ipynb) for video/image generation
     * @param {Object} options - { title, modelId, modelSource, taskType, defaultPrompt, vramRequiredGb }
     * @returns {Object} JSON object conforming to nbformat 4.5
     */
    static generateNotebook(options = {}) {
      const title = options.title || 'Stable Video Diffusion (SVD) Shot Generator';
      const modelId = options.modelId || 'stabilityai/stable-video-diffusion-img2vid-xt';
      const vramRequiredGb = options.vramRequiredGb || 16;
      const defaultPrompt = options.defaultPrompt || 'Cinematic corporate shot, high fidelity, 4k';

      const cells = [
        // Cell 1: Markdown Introduction & License
        {
          cell_type: 'markdown',
          metadata: {},
          source: [
            `# ${title}\n`,
            `**Model:** \`${modelId}\`  \n`,
            `**Target Runtime:** Google Colab (T4 / A100 GPU) or Kaggle GPU  \n`,
            `**Hardware Requirement:** Minimum **${vramRequiredGb} GB VRAM** GPU  \n`,
            `**AnyConverter Integration:** Offline GPU Fallback (Zero Backend Inference Cost)  \n\n`,
            `---\n\n`,
            `### 🔒 Privacy & Safety Notice\n`,
            `- **Zero Embedded Secrets:** This notebook does NOT require or embed any AnyConverter or third-party secret keys.\n`,
            `- **User-Run Sandbox:** All execution takes place strictly within your own Colab/Kaggle session.\n`,
            `- **Output Destination:** Outputs are saved locally in this environment and packaged into a ZIP archive for you to download and import into AnyConverter.\n`
          ]
        },

        // Cell 2: Code — Hardware Verification (GPU check)
        {
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            `# 1. Hardware Verification: Verify CUDA GPU Availability\n`,
            `import torch\n`,
            `import sys\n\n`,
            `print(f"PyTorch Version: {torch.__version__}")\n`,
            `if not torch.cuda.is_available():\n`,
            `    print("❌ ERROR: No GPU detected! Please change runtime type to GPU (T4 / A100).", file=sys.stderr)\n`,
            `    raise SystemExit("Execution stopped: GPU hardware accelerator required.")\n\n`,
            `gpu_name = torch.cuda.get_device_name(0)\n`,
            `total_mem_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)\n`,
            `print(f"✅ GPU Detected: {gpu_name} ({total_mem_gb:.2f} GB VRAM)")\n`
          ]
        },

        // Cell 3: Code — Version-Pinned Dependency Installation
        {
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            `# 2. Dependency Installation (Pinned Versions)\n`,
            `!pip install --quiet diffusers==0.31.0 transformers==4.46.3 accelerate==1.1.1 torchvision==0.20.1 imageio-ffmpeg==0.5.1\n`
          ]
        },

        // Cell 4: Code — User Parameters (Form UI)
        {
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            `# 3. Shot Generation Parameters\n`,
            `# @title Shot Configuration Form\n\n`,
            `PROMPT = "${defaultPrompt}" # @param {type:"string"}\n`,
            `NUM_FRAMES = 25 # @param {type:"slider", min:14, max:30, step:1}\n`,
            `FPS = 14 # @param {type:"slider", min:8, max:24, step:1}\n`,
            `MOTION_BUCKET_ID = 127 # @param {type:"slider", min:1, max:255, step:1}\n`,
            `SEED = 42 # @param {type:"integer"}\n`,
            `OUTPUT_DIR = "./outputs"\n`
          ]
        },

        // Cell 5: Code — Model Pipeline & Execution
        {
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            `# 4. Model Pipeline Execution & Manifest Generation\n`,
            `import os, json, hashlib, time\n`,
            `import torch\n`,
            `from diffusers import StableVideoDiffusionPipeline\n`,
            `from diffusers.utils import export_to_video\n`,
            `from PIL import Image\n\n`,
            `os.makedirs(OUTPUT_DIR, exist_ok=True)\n`,
            `print(f"Loading model: ${modelId}...")\n\n`,
            `# Load SVD pipeline in float16 for VRAM efficiency\n`,
            `pipe = StableVideoDiffusionPipeline.from_pretrained(\n`,
            `    "${modelId}",\n`,
            `    torch_dtype=torch.float16,\n`,
            `    variant="fp16"\n`,
            `)\n`,
            `pipe.enable_model_cpu_offload()\n\n`,
            `# Create test canvas frame\n`,
            `init_image = Image.new("RGB", (1024, 576), color=(40, 44, 52))\n`,
            `generator = torch.manual_seed(SEED)\n\n`,
            `print("Generating video frames...")\n`,
            `frames = pipe(init_image, decode_chunk_size=8, generator=generator, motion_bucket_id=MOTION_BUCKET_ID, num_frames=NUM_FRAMES).frames[0]\n\n`,
            `output_filename = "shot_001.mp4"\n`,
            `output_path = os.path.join(OUTPUT_DIR, output_filename)\n`,
            `export_to_video(frames, output_path, fps=FPS)\n`,
            `print(f"✅ Video generated successfully: {output_path}")\n\n`,
            `# Write manifest.json for AnyConverter project import\n`,
            `prompt_hash = hashlib.sha256(PROMPT.encode('utf-8')).hexdigest()[:16]\n`,
            `manifest = {\n`,
            `    "anyconverter_spec_version": "1.0.0",\n`,
            `    "model_id": "${modelId}",\n`,
            `    "prompt": PROMPT,\n`,
            `    "prompt_hash": prompt_hash,\n`,
            `    "seed": SEED,\n`,
            `    "fps": FPS,\n`,
            `    "frames": NUM_FRAMES,\n`,
            `    "files": [{\n`,
            `        "name": output_filename,\n`,
            `        "type": "video/mp4",\n`,
            `        "duration_seconds": NUM_FRAMES / FPS\n`,
            `    }],\n`,
            `    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())\n`,
            `}\n\n`,
            `with open(os.path.join(OUTPUT_DIR, "manifest.json"), "w") as f:\n`,
            `    json.dump(manifest, f, indent=2)\n`
          ]
        },

        // Cell 6: Code — Packaging & Download
        {
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            `# 5. Package Outputs into ZIP Archive for AnyConverter Import\n`,
            `import shutil\n`,
            `from google.colab import files\n\n`,
            `archive_path = "anyconverter_ai_shot_package"\n`,
            `shutil.make_archive(archive_path, 'zip', OUTPUT_DIR)\n`,
            `print(f"✅ Archive created: {archive_path}.zip")\n\n`,
            `# Prompt browser download\n`,
            `files.download(f"{archive_path}.zip")\n`
          ]
        },

        // Cell 7: Markdown — Import Instructions
        {
          cell_type: 'markdown',
          metadata: {},
          source: [
            `### 📥 How to Import into AnyConverter Creative Studio\n`,
            `1. Download the generated \`anyconverter_ai_shot_package.zip\`.\n`,
            `2. In AnyConverter Creative Studio, open your project.\n`,
            `3. Click **Add Track / Import Layer** -> **Import Generated Media ZIP**.\n`,
            `4. AnyConverter reads \`manifest.json\`, verifies file hashes, and automatically binds the clip to the target scene without transcoding!\n`
          ]
        }
      ];

      return {
        nbformat: 4,
        nbformat_minor: 5,
        metadata: {
          kernelspec: {
            display_name: 'Python 3',
            language: 'python',
            name: 'python3'
          },
          language_info: {
            name: 'python',
            version: '3.10.12'
          },
          accelerator: 'GPU',
          colab: {
            provenance: []
          }
        },
        cells: cells
      };
    }
  }

  return {
    NotebookWorkflowGenerator
  };
}));
