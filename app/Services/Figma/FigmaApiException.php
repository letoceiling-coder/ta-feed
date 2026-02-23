<?php

namespace App\Services\Figma;

use Exception;

class FigmaApiException extends Exception
{
    public function __construct(
        string $message,
        private readonly int $statusCode,
        private readonly string $context = '',
    ) {
        parent::__construct($message);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getContext(): string
    {
        return $this->context;
    }
}
