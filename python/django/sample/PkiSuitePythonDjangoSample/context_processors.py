from config import Config


def config(request):
    """
    Makes the sample's settings (config.py) available to every template as
    "Config". The layout reads the Web PKI license and the REST PKI endpoint
    from it.
    """
    return {'Config': Config}
