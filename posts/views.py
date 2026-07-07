from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.http import require_POST

from .models import Post


def post_list(request):
    query = request.GET.get("q", "").strip()
    posts = Post.objects.all()
    if query:
        posts = posts.filter(Q(title__icontains=query) | Q(content__icontains=query))
    return render(request, "posts/post_list.html", {"posts": posts, "query": query})


def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)

    # Hitung view sekali per sesi agar refresh tidak menambah angka
    viewed = request.session.setdefault("viewed_posts", [])
    if post.pk not in viewed:
        Post.objects.filter(pk=post.pk).update(views=post.views + 1)
        post.views += 1
        viewed.append(post.pk)
        request.session.modified = True

    liked = post.pk in request.session.get("liked_posts", [])
    return render(request, "posts/post_detail.html", {"post": post, "liked": liked})


@require_POST
def post_like(request, slug):
    post = get_object_or_404(Post, slug=slug)
    liked_posts = request.session.setdefault("liked_posts", [])

    if post.pk in liked_posts:
        liked_posts.remove(post.pk)
        post.likes = max(0, post.likes - 1)
        liked = False
    else:
        liked_posts.append(post.pk)
        post.likes += 1
        liked = True

    post.save(update_fields=["likes"])
    request.session.modified = True
    return JsonResponse({"likes": post.likes, "liked": liked})


def post_search_api(request):
    query = request.GET.get("q", "").strip()
    results = []
    if query:
        posts = Post.objects.filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )[:6]
        results = [
            {
                "title": p.title,
                "url": p.get_absolute_url(),
                "excerpt": p.excerpt[:120],
                "reading_time": p.reading_time,
            }
            for p in posts
        ]
    return JsonResponse({"results": results})
