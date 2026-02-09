import websocket
import uuid
import json
import urllib.request
import urllib.parse
import sys
import time
import os

def queue_prompt(prompt, client_id, server_address="127.0.0.1:8188"):
    p = {"prompt": prompt, "client_id": client_id}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request(f"http://{server_address}/prompt", data=data)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as e:
        print(f"[API] HTTP Error {e.code}: {e.reason}")
        error_body = e.read().decode('utf-8')
        print(f"[API] Error Details: {error_body}")
        raise

def get_history(prompt_id, server_address="127.0.0.1:8188"):
    with urllib.request.urlopen(f"http://{server_address}/history/{prompt_id}") as response:
        return json.loads(response.read())

def run_workflow(workflow_path, overrides=None):
    server_address = "127.0.0.1:8188"
    client_id = str(uuid.uuid4())
    
    with open(workflow_path, 'r', encoding='utf-8') as f:
        prompt = json.load(f)
        
    # Apply overrides (e.g., changing text prompts or seeds)
    if overrides:
        for node_id, widgets in overrides.items():
            if str(node_id) in prompt:
                target_node = prompt[str(node_id)]
                if "inputs" in target_node:
                    for widget_key, value in widgets.items():
                        target_node["inputs"][widget_key] = value
                        print(f"[API] Override: Node {node_id}, {widget_key} = {value}")

    ws = websocket.WebSocket()
    ws.connect(f"ws://{server_address}/ws?clientId={client_id}")
    
    print(f"[API] Sending workflow: {os.path.basename(workflow_path)}")
    prompt_id = queue_prompt(prompt, client_id, server_address)['prompt_id']
    
    while True:
        out = ws.recv()
        if isinstance(out, str):
            message = json.loads(out)
            if message['type'] == 'executing':
                data = message['data']
                if data['node'] is None and data['prompt_id'] == prompt_id:
                    break # Execution finished
                else:
                    print(f"[API] Now executing node: {data['node']}")
        else:
            continue
            
    ws.close()
    history = get_history(prompt_id, server_address)[prompt_id]
    print("[API] Workflow Complete.")
    return history

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python comfy-api-bridge.py <workflow.json> [positive_prompt] [negative_prompt] [node_id]")
        sys.exit(1)
        
    workflow = sys.argv[1]
    overrides = {}
    
    if len(sys.argv) >= 3:
        # Simple override for standard workflows: Node 2 is usually positive CLIP
        overrides["2"] = {"text": sys.argv[2]}
    if len(sys.argv) >= 4:
        # Node 3 is usually negative CLIP
        overrides["3"] = {"text": sys.argv[3]}
        
    run_workflow(workflow, overrides if overrides else None)
