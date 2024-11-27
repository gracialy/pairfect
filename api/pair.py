from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from utils.auth import authenticate_user
from utils.google import GoogleAPIClient

router = APIRouter()
google_client = GoogleAPIClient() 

@router.post("/api/pair")
async def pair_images(
    keyword: str,
    # image: UploadFile = File(...),
    max_results: int = 5,
    user: dict = Depends(authenticate_user)
):
    """
    Analyze uploaded image and find matching pairs based on analysis and keyword.

    Parameters:
    - **keyword**: Search keyword.
    - **image**: Uploaded image file.
    - **max_results**: Maximum images to analyze.
    - **Authorization**: Bearer <your_token>.

    Returns:
    - Analysis results and matching images.
    """
    try:
        # Read and encode image
        # image_content = await image.read()
        
        # Analyze image
        # analysis_results = await google_client.analyze_image(image_content)
        
        # Search for matching images
        matching_images = await google_client.find_matching_images(
            # analysis_results,
            keyword,
            max_results
        )
        
        return {
            "keyword": keyword,
            # "analysis": analysis_results,
            "matching_images": matching_images
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")