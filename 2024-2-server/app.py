from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # CORS 설정

# YouTube API 키와 기타 설정
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')   # 실제 API 키로 대체해야 합니다

def fetch_youtube_data(query, page_token=''):
    url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q={query}&key={YOUTUBE_API_KEY}&maxResults=50&pageToken={page_token}'
    response = requests.get(url)
    return response.json()

def fetch_video_stats(video_ids):
    url = f'https://www.googleapis.com/youtube/v3/videos?part=statistics&id={",".join(video_ids)}&key={YOUTUBE_API_KEY}'
    response = requests.get(url)
    return response.json()

def fetch_channel_stats(channel_ids):
    url = f'https://www.googleapis.com/youtube/v3/channels?part=statistics&id={",".join(channel_ids)}&key={YOUTUBE_API_KEY}'
    response = requests.get(url)
    return response.json()

@app.route('/search_youtube', methods=['GET'])
def search_youtube():
    query = request.args.get('query')
    page_token = request.args.get('pageToken', '')

    search_results = fetch_youtube_data(query, page_token)
    items = search_results.get('items', [])
    next_page_token = search_results.get('nextPageToken', '')

    video_ids = [item['id']['videoId'] for item in items]
    video_stats = fetch_video_stats(video_ids)
    video_stats_dict = {video['id']: video['statistics'] for video in video_stats.get('items', [])}

    channel_ids = list(set(item['snippet']['channelId'] for item in items))
    channel_stats = fetch_channel_stats(channel_ids)
    channel_stats_dict = {channel['id']: channel['statistics']['subscriberCount'] for channel in channel_stats.get('items', [])}

    processed_items = []
    for item in items:
        video_id = item['id']['videoId']
        channel_id = item['snippet']['channelId']
        processed_items.append({
            'thumbnail': item['snippet']['thumbnails']['high']['url'],
            'title': item['snippet']['title'],
            'channelTitle': item['snippet']['channelTitle'],
            'videoUrl': f'https://www.youtube.com/watch?v={video_id}',
            'viewCount': video_stats_dict.get(video_id, {}).get('viewCount', '0'),
            'subscriberCount': channel_stats_dict.get(channel_id, '0'),
            'publishedAt': item['snippet']['publishedAt'],
            'description': item['snippet']['description']
        })

    response = {
        'items': processed_items,
        'nextPageToken': next_page_token
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
