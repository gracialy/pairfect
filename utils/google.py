import os
from typing import Dict, List
from dotenv import load_dotenv
from fastapi import HTTPException
import requests

# Load environment variables locally
if not os.getenv('VERCEL'):
    load_dotenv()

class GoogleAPIClient:
    def __init__(self):
        self.api_key = os.environ.get('GOOGLE_API_KEY')
        self.cse_id = os.environ.get('GOOGLE_CSE_ID')
        
        if not self.api_key or not self.cse_id:
            raise ValueError("Missing Google API credentials in environment variables")
            
        self.search_url = "https://www.googleapis.com/customsearch/v1"
        # self.vision_url = "https://vision.googleapis.com/v1/images:annotate"

    async def analyze_image(self, image_content: bytes) -> Dict:
        """Analyze image using Google Vision AI"""
        try:
            request_json = {
                "requests": [{
                    "image": {"content": image_content},
                    "features": [
                        {"type": "LABEL_DETECTION"},
                        {"type": "IMAGE_PROPERTIES"},
                        {"type": "SAFE_SEARCH_DETECTION"}
                    ]
                }]
            }
            
            response = requests.post(
                f"{self.vision_url}?key={self.api_key}",
                json=request_json
            )
            response.raise_for_status()
            
            return response.json()
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Vision API error: {str(e)}")

    async def search_images(self, keyword: str, max_results: int = 5) -> List[Dict]:
        """Search for images using Custom Search API"""
        try:
            response = requests.get(
                self.search_url,
                params={
                    "key": self.api_key,
                    "cx": self.cse_id,
                    "q": keyword,
                    "searchType": "image",
                    "num": min(max_results, 10),
                }
            )
            response.raise_for_status()
            
            data = response.json()
            return [
                {
                    "title": item.get("title"),
                    "link": item.get("link"),
                    "thumbnail": item.get("image", {}).get("thumbnailLink"),
                    "context_link": item.get("image", {}).get("contextLink"),
                }
                for item in data.get("items", [])
            ]
        except requests.exceptions.RequestException as e:
            raise ValueError(f"Search API error: {str(e)}")

    async def find_matching_images(
        self,
        # analysis_results: Dict,
        keyword: str,
        max_results: int = 5
    ) -> List[Dict]:
        """Find matching images based on analysis and keyword"""
        # Extract relevant features from analysis
        # labels = [
        #     label["description"] 
        #     for label in analysis_results.get("labelAnnotations", [])
        # ]
        
        # Combine keyword with top labels for better search
        # enhanced_query = f"{keyword} {' '.join(labels[:3])}"
        enhanced_query = keyword
        
        return await self.search_images(enhanced_query, max_results)