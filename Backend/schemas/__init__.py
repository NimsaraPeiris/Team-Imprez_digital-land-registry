# re-export existing schemas
from . import admin_schemas, common, user_schemas
from .service_schemas import (
    LandTransferRequest,
    CopyOfLandRequest,
    SearchLandRequest,
    DuplicateDeedsRequest,
    CopyDocumentRequest,
)
