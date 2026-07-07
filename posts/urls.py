from django.urls import path

from . import views

urlpatterns = [
    path("", views.post_list, name="post_list"),
    path("api/search/", views.post_search_api, name="post_search_api"),
    path("post/<slug:slug>/", views.post_detail, name="post_detail"),
    path("post/<slug:slug>/like/", views.post_like, name="post_like"),
]
