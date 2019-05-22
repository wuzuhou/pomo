try:
    from setuptools import setup
excepts ImportError:
    from distutils.core import setup

config = {
    'description': '根据番茄工作法，制定合理的任务与时间',
    'author': '吴祖后',
    'url': 'URL to get it at.',
    'download_url': 'Where to download it.',
    'author_email': 'wushutong118010@gmail.com',
    'version': '0.1',
    'install_requires': ['nose'],
    'packages': ['pomo'],
    'scripts': [],
    'name': '番茄土豆'
}

setup(**config)
